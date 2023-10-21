#!/usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import csv
import time
import copy
from collections import deque

import cv2 as cv
import numpy as np
import tensorflow as tf

from utils import CvFpsCalc
from utils import CvDrawText


def get_args():
    parser = argparse.ArgumentParser()

    parser.add_argument("--device", type=int, default=0)
    parser.add_argument("--width", help='cap width', type=int, default=960)
    parser.add_argument("--height", help='cap height', type=int, default=540)
    parser.add_argument("--file", type=str, default=None)

    parser.add_argument("--fps", type=int, default=10)
    parser.add_argument("--skip_frame", type=int, default=0)

    parser.add_argument("--model", default='model/EfficientDetD0/saved_model')
    parser.add_argument("--score_th", type=float, default=0.75)

    parser.add_argument("--sign_interval", type=float, default=2.0)
    parser.add_argument("--jutsu_display_time", type=int, default=5)

    parser.add_argument("--use_display_score", type=bool, default=False)
    parser.add_argument("--erase_bbox", type=bool, default=False)
    parser.add_argument("--use_jutsu_lang_en", type=bool, default=False)

    parser.add_argument("--chattering_check", type=int, default=1)

    parser.add_argument("--use_fullscreen", type=bool, default=False)

    args = parser.parse_args()

    return args


def run_inference_single_image(image, inference_func):
    tensor = tf.convert_to_tensor(image)
    output = inference_func(tensor)

    output['num_detections'] = int(output['num_detections'][0])
    output['detection_classes'] = output['detection_classes'][0].numpy()
    output['detection_boxes'] = output['detection_boxes'][0].numpy()
    output['detection_scores'] = output['detection_scores'][0].numpy()
    return output


def main():
    # argument parsing #################################################################
    args = get_args()

    cap_width = args.width
    cap_height = args.height
    cap_device = args.device
    if args.file is not None:  # When using video files
        cap_device = args.file

    fps = args.fps
    skip_frame = args.skip_frame

    model_path = args.model
    score_th = args.score_th

    sign_interval = args.sign_interval
    jutsu_display_time = args.jutsu_display_time

    use_display_score = args.use_display_score
    erase_bbox = args.erase_bbox
    use_jutsu_lang_en = args.use_jutsu_lang_en

    chattering_check = args.chattering_check

    use_fullscreen = args.use_fullscreen

    # camera ready ###############################################################
    cap = cv.VideoCapture(cap_device)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, cap_width)
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, cap_height)

    # Load model ############################################################
    DEFAULT_FUNCTION_KEY = 'serving_default'
    loaded_model = tf.saved_model.load(model_path)
    inference_func = loaded_model.signatures[DEFAULT_FUNCTION_KEY]

    # FPS measurement module #########################################################
    cvFpsCalc = CvFpsCalc()

    # Load font ##########################################################
    # https://opentype.jp/kouzanmouhitufont.htm
    font_path = './utils/font/衡山毛筆フォント.ttf'

    # Label loading ###########################################################
    with open('setting/labels.csv', encoding='utf8') as f:  # 印
        labels = csv.reader(f)
        labels = [row for row in labels]

    with open('setting/jutsu.csv', encoding='utf8') as f:  # 術
        jutsu = csv.reader(f)
        jutsu = [row for row in jutsu]

    # Mark display history and detection history ##############################################
    sign_max_display = 18
    sign_max_history = 44
    sign_display_queue = deque(maxlen=sign_max_display)
    sign_history_queue = deque(maxlen=sign_max_history)

    chattering_check_queue = deque(maxlen=chattering_check)
    for index in range(-1, -1 - chattering_check, -1):
        chattering_check_queue.append(index)

    # Language setting for surgical name ###########################################################
    lang_offset = 0
    jutsu_font_size_ratio = sign_max_display
    if use_jutsu_lang_en:
        lang_offset = 1
        jutsu_font_size_ratio = int((sign_max_display / 3) * 4)

    # Initialize other variables #########################################################
    sign_interval_start = 0  # Initialize mark interval start time
    jutsu_index = 0  # index of technical display name
    jutsu_start_time = 0  # Initialize start time of technique name display
    frame_count = 0  # frame number counter

    window_name = 'NARUTO HandSignDetection Ninjutsu Demo'
    if use_fullscreen:
        cv.namedWindow(window_name, cv.WINDOW_NORMAL)

    while True:
        start_time = time.time()

        # camera capture #####################################################
        ret, frame = cap.read()
        if not ret:
            continue
        frame_count += 1
        debug_image = copy.deepcopy(frame)

        if (frame_count % (skip_frame + 1)) != 0:
            continue

        # FPS measurement ##############################################################
        fps_result = cvFpsCalc.get()

        # Detection implementation #############################################################
        frame = frame[:, :, [2, 1, 0]]  # BGR2RGB
        image_np_expanded = np.expand_dims(frame, axis=0)
        result_inference = run_inference_single_image(image_np_expanded,
                                                      inference_func)

        # Addition of detection history ####################################################
        num_detections = result_inference['num_detections']
        for i in range(num_detections):
            score = result_inference['detection_scores'][i]
            class_id = result_inference['detection_classes'][i].astype(np.int)

            # Discard results below detection threshold
            if score < score_th:
                continue

            # If the same mark continues for more than a specified number of times, it will be considered as a mark detected. *To prevent instantaneous false detection.
            chattering_check_queue.append(class_id)
            if len(set(chattering_check_queue)) != 1:
                continue

            # Register in queue only if the mark is different from last time
            if len(sign_display_queue) == 0 or \
                sign_display_queue[-1] != class_id:
                sign_display_queue.append(class_id)
                sign_history_queue.append(class_id)
                sign_interval_start = time.time()  # Last detection time of mark

        # If the specified time has passed since the last mark detection, the history will be deleted. ####################
        if (time.time() - sign_interval_start) > sign_interval:
            sign_display_queue.clear()
            sign_history_queue.clear()

        # Judgment of establishment of technique #########################################################
        jutsu_index, jutsu_start_time = check_jutsu(
            sign_history_queue,
            labels,
            jutsu,
            jutsu_index,
            jutsu_start_time,
        )

        # key processing ###########################################################
        key = cv.waitKey(1)
        if key == 99:  # C：Clear history of markings
            sign_display_queue.clear()
            sign_history_queue.clear()
        if key == 27:  # ESC：The end of the program
            break

        # FPS adjustment #############################################################
        elapsed_time = time.time() - start_time
        sleep_time = max(0, ((1.0 / fps) - elapsed_time))
        time.sleep(sleep_time)

        # Screen reflection #############################################################
        debug_image = draw_debug_image(
            debug_image,
            font_path,
            fps_result,
            labels,
            result_inference,
            score_th,
            erase_bbox,
            use_display_score,
            jutsu,
            sign_display_queue,
            sign_max_display,
            jutsu_display_time,
            jutsu_font_size_ratio,
            lang_offset,
            jutsu_index,
            jutsu_start_time,
        )
        if use_fullscreen:
            cv.setWindowProperty(window_name, cv.WND_PROP_FULLSCREEN,
                                 cv.WINDOW_FULLSCREEN)
        cv.imshow(window_name, debug_image)
        # cv.moveWindow(window_name, 100, 100)

    cap.release()
    cv.destroyAllWindows()


def check_jutsu(
    sign_history_queue,
    labels,
    jutsu,
    jutsu_index,
    jutsu_start_time,
):
    # Matching the name of the technique from the history of the seal
    sign_history = ''
    if len(sign_history_queue) > 0:
        for sign_id in sign_history_queue:
            sign_history = sign_history + labels[sign_id][1]
        for index, signs in enumerate(jutsu):
            if sign_history == ''.join(signs[4:]):
                jutsu_index = index
                jutsu_start_time = time.time()  # Last detection time of surgery
                break

    return jutsu_index, jutsu_start_time


def draw_debug_image(
    debug_image,
    font_path,
    fps_result,
    labels,
    result_inference,
    score_th,
    erase_bbox,
    use_display_score,
    jutsu,
    sign_display_queue,
    sign_max_display,
    jutsu_display_time,
    jutsu_font_size_ratio,
    lang_offset,
    jutsu_index,
    jutsu_start_time,
):
    frame_width, frame_height = debug_image.shape[1], debug_image.shape[0]

    # Superimposed display of bounding box of mark (when display option is enabled) ###################
    if not erase_bbox:
        num_detections = result_inference['num_detections']
        for i in range(num_detections):
            score = result_inference['detection_scores'][i]
            bbox = result_inference['detection_boxes'][i]
            class_id = result_inference['detection_classes'][i].astype(np.int)

            # Discard bounding boxes below the detection threshold
            if score < score_th:
                continue

            x1, y1 = int(bbox[1] * frame_width), int(bbox[0] * frame_height)
            x2, y2 = int(bbox[3] * frame_width), int(bbox[2] * frame_height)

            # Bounding box (display a square along the long side)
            x_len = x2 - x1
            y_len = y2 - y1
            square_len = x_len if x_len >= y_len else y_len
            square_x1 = int(((x1 + x2) / 2) - (square_len / 2))
            square_y1 = int(((y1 + y2) / 2) - (square_len / 2))
            square_x2 = square_x1 + square_len
            square_y2 = square_y1 + square_len
            cv.rectangle(debug_image, (square_x1, square_y1),
                         (square_x2, square_y2), (255, 255, 255), 4)
            cv.rectangle(debug_image, (square_x1, square_y1),
                         (square_x2, square_y2), (0, 0, 0), 2)

            # Type of mark
            font_size = int(square_len / 2)
            debug_image = CvDrawText.puttext(
                debug_image, labels[class_id][1],
                (square_x2 - font_size, square_y2 - font_size), font_path,
                font_size, (185, 0, 0))

            # Detection score (when display option is enabled)
            if use_display_score:
                font_size = int(square_len / 8)
                debug_image = CvDrawText.puttext(
                    debug_image, '{:.3f}'.format(score),
                    (square_x1 + int(font_size / 4),
                     square_y1 + int(font_size / 4)), font_path, font_size,
                    (185, 0, 0))

    # Header creation：FPS #########################################################
    header_image = np.zeros((int(frame_height / 18), frame_width, 3), np.uint8)
    header_image = CvDrawText.puttext(header_image, "FPS:" + str(fps_result),
                                      (5, 0), font_path,
                                      int(frame_height / 20), (255, 255, 255))

    # Footer creation: History of seal and technique name display ####################################
    footer_image = np.zeros((int(frame_height / 10), frame_width, 3), np.uint8)

    # History string generation for marks
    sign_display = ''
    if len(sign_display_queue) > 0:
        for sign_id in sign_display_queue:
            sign_display = sign_display + labels[sign_id][1]

    # Technique name display (designated time drawing)
    if lang_offset == 0:
        separate_string = '・'
    else:
        separate_string = '：'
    if (time.time() - jutsu_start_time) < jutsu_display_time:
        if jutsu[jutsu_index][0] == '':  # When there is no definition of attribute (Katon, etc.)
            jutsu_string = jutsu[jutsu_index][2 + lang_offset]
        else:  # If there is an attribute definition (Katon, etc.)
            jutsu_string = jutsu[jutsu_index][0 + lang_offset] + \
                separate_string + jutsu[jutsu_index][2 + lang_offset]
        footer_image = CvDrawText.puttext(
            footer_image, jutsu_string, (5, 0), font_path,
            int(frame_width / jutsu_font_size_ratio), (255, 255, 255))
    # Seal means
    else:
        footer_image = CvDrawText.puttext(footer_image, sign_display, (5, 0),
                                          font_path,
                                          int(frame_width / sign_max_display),
                                          (255, 255, 255))

    # Combine header and footer into debug image ######################################
    debug_image = cv.vconcat([header_image, debug_image])
    debug_image = cv.vconcat([debug_image, footer_image])

    return debug_image


if __name__ == '__main__':
    main()
