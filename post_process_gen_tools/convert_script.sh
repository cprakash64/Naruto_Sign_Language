#!/bin/bash

# pip install -U pip \
# && pip install onnxsim
# && pip install -U simple-onnx-processing-tools \
# && pip install -U onnx \
# && python3 -m pip install -U onnx_graphsurgeon --index-url https://pypi.ngc.nvidia.com \
# && pip install tensorflow==2.12.0

OPSET=11
BATCHES=1
BOXES=3549
CLASSES=16

################################################### Grids
python make_grids.py -o ${OPSET} -x ${BOXES} -c ${CLASSES}

################################################### Boxes + Scores
python make_boxes_scores.py -o ${OPSET} -b ${BATCHES} -x ${BOXES} -c ${CLASSES}
python make_cxcywh_y1x1y2x2.py -o ${OPSET} -b ${BATCHES} -x ${BOXES}

snc4onnx \
--input_onnx_file_paths 02_boxes_scores_${BOXES}.onnx 03_cxcywh_y1x1y2x2_${BOXES}.onnx \
--srcop_destop boxes_cxcywh cxcywh \
--op_prefixes_after_merging 02 03 \
--output_onnx_file_path 04_boxes_x1y1x2y2_y1x1y2x2_scores_${BOXES}.onnx

snc4onnx \
--input_onnx_file_paths 01_grid_${BOXES}.onnx 04_boxes_x1y1x2y2_y1x1y2x2_scores_${BOXES}.onnx \
--srcop_destop grid_output boxes_scores_input \
--output_onnx_file_path 04_boxes_x1y1x2y2_y1x1y2x2_scores_${BOXES}.onnx



################################################### NonMaxSuppression
sog4onnx \
--op_type Constant \
--opset ${OPSET} \
--op_name max_output_boxes_per_class_const \
--output_variables max_output_boxes_per_class int64 [1] \
--attributes value int64 [1] \
--output_onnx_file_path 05_Constant_max_output_boxes_per_class.onnx

sog4onnx \
--op_type Constant \
--opset ${OPSET} \
--op_name iou_threshold_const \
--output_variables iou_threshold float32 [1] \
--attributes value float32 [0.45] \
--output_onnx_file_path 06_Constant_iou_threshold.onnx

sog4onnx \
--op_type Constant \
--opset ${OPSET} \
--op_name score_threshold_const \
--output_variables score_threshold float32 [1] \
--attributes value float32 [0.1] \
--output_onnx_file_path 07_Constant_score_threshold.onnx


OP=NonMaxSuppression
LOWEROP=${OP,,}
sog4onnx \
--op_type ${OP} \
--opset ${OPSET} \
--op_name ${LOWEROP}${OPSET} \
--input_variables boxes_var float32 [${BATCHES},${BOXES},4] \
--input_variables scores_var float32 [${BATCHES},${CLASSES},${BOXES}] \
--input_variables max_output_boxes_per_class_var int64 [1] \
--input_variables iou_threshold_var float32 [1] \
--input_variables score_threshold_var float32 [1] \
--output_variables selected_indices int64 [\'N\',3] \
--attributes center_point_box int64 0 \
--output_onnx_file_path 08_${OP}${OPSET}.onnx


snc4onnx \
--input_onnx_file_paths 05_Constant_max_output_boxes_per_class.onnx 08_${OP}${OPSET}.onnx \
--srcop_destop max_output_boxes_per_class max_output_boxes_per_class_var \
--output_onnx_file_path 08_${OP}${OPSET}.onnx

snc4onnx \
--input_onnx_file_paths 06_Constant_iou_threshold.onnx 08_${OP}${OPSET}.onnx \
--srcop_destop iou_threshold iou_threshold_var \
--output_onnx_file_path 08_${OP}${OPSET}.onnx

snc4onnx \
--input_onnx_file_paths 07_Constant_score_threshold.onnx 08_${OP}${OPSET}.onnx \
--srcop_destop score_threshold score_threshold_var \
--output_onnx_file_path 08_${OP}${OPSET}.onnx

soc4onnx \
--input_onnx_file_path 08_${OP}${OPSET}.onnx \
--output_onnx_file_path 08_${OP}${OPSET}.onnx \
--opset ${OPSET}


################################################### Boxes + Scores + NonMaxSuppression
snc4onnx \
--input_onnx_file_paths 04_boxes_x1y1x2y2_y1x1y2x2_scores_${BOXES}.onnx 08_${OP}${OPSET}.onnx \
--srcop_destop scores scores_var y1x1y2x2 boxes_var \
--output_onnx_file_path 09_nms_yolox_${BOXES}.onnx


################################################### Myriad workaround Mul
OP=Mul
LOWEROP=${OP,,}
OPSET=${OPSET}
sog4onnx \
--op_type ${OP} \
--opset ${OPSET} \
--op_name ${LOWEROP}${OPSET} \
--input_variables workaround_mul_a int64 [\'N\',3] \
--input_variables workaround_mul_b int64 [1] \
--output_variables workaround_mul_out int64 [\'N\',3] \
--output_onnx_file_path 10_${OP}${OPSET}_workaround.onnx


############ Myriad workaround Constant
sog4onnx \
--op_type Constant \
--opset ${OPSET} \
--op_name workaround_mul_const_op \
--output_variables workaround_mul_const int64 [1] \
--attributes value int64 [1] \
--output_onnx_file_path 11_Constant_workaround_mul.onnx

############ Myriad workaround Mul + Myriad workaround Constant
snc4onnx \
--input_onnx_file_paths 11_Constant_workaround_mul.onnx 10_${OP}${OPSET}_workaround.onnx \
--srcop_destop workaround_mul_const workaround_mul_b \
--output_onnx_file_path 11_Constant_workaround_mul.onnx



################################################### NonMaxSuppression + Myriad workaround Mul
snc4onnx \
--input_onnx_file_paths 09_nms_yolox_${BOXES}.onnx 11_Constant_workaround_mul.onnx \
--srcop_destop selected_indices workaround_mul_a \
--output_onnx_file_path 09_nms_yolox_${BOXES}.onnx



################################################### Score GatherND
python make_score_gather_nd.py -b ${BATCHES} -x ${BOXES} -c ${CLASSES}

python -m tf2onnx.convert \
--opset ${OPSET} \
--tflite saved_model_postprocess/nms_score_gather_nd.tflite \
--output 12_nms_score_gather_nd.onnx

sor4onnx \
--input_onnx_file_path 12_nms_score_gather_nd.onnx \
--old_new ":0" "" \
--search_mode "suffix_match" \
--output_onnx_file_path 12_nms_score_gather_nd.onnx

sor4onnx \
--input_onnx_file_path 12_nms_score_gather_nd.onnx \
--old_new "serving_default_input_1" "gn_scores" \
--output_onnx_file_path 12_nms_score_gather_nd.onnx \
--mode inputs

sor4onnx \
--input_onnx_file_path 12_nms_score_gather_nd.onnx \
--old_new "serving_default_input_2" "gn_selected_indices" \
--output_onnx_file_path 12_nms_score_gather_nd.onnx \
--mode inputs

sor4onnx \
--input_onnx_file_path 12_nms_score_gather_nd.onnx \
--old_new "PartitionedCall" "final_scores" \
--output_onnx_file_path 12_nms_score_gather_nd.onnx \
--mode outputs

python make_input_output_shape_update.py \
--input_onnx_file_path 12_nms_score_gather_nd.onnx \
--output_onnx_file_path 12_nms_score_gather_nd.onnx \
--input_names gn_scores \
--input_names gn_selected_indices \
--input_shapes ${BATCHES} ${CLASSES} ${BOXES} \
--input_shapes N 3 \
--output_names final_scores \
--output_shapes N 1

onnxsim 12_nms_score_gather_nd.onnx 12_nms_score_gather_nd.onnx
onnxsim 12_nms_score_gather_nd.onnx 12_nms_score_gather_nd.onnx


################################################### NonMaxSuppression + Score GatherND
snc4onnx \
--input_onnx_file_paths 09_nms_yolox_${BOXES}.onnx 12_nms_score_gather_nd.onnx \
--srcop_destop scores gn_scores workaround_mul_out gn_selected_indices \
--output_onnx_file_path 09_nms_yolox_${BOXES}_nd.onnx

onnxsim 09_nms_yolox_${BOXES}_nd.onnx 09_nms_yolox_${BOXES}_nd.onnx
onnxsim 09_nms_yolox_${BOXES}_nd.onnx 09_nms_yolox_${BOXES}_nd.onnx


################################################### Final Batch Nums
python make_final_batch_nums_final_class_nums_final_box_nums.py


################################################### Boxes GatherND
python make_box_gather_nd.py

python -m tf2onnx.convert \
--opset ${OPSET} \
--tflite saved_model_postprocess/nms_box_gather_nd.tflite \
--output 14_nms_box_gather_nd.onnx

sor4onnx \
--input_onnx_file_path 14_nms_box_gather_nd.onnx \
--old_new ":0" "" \
--search_mode "suffix_match" \
--output_onnx_file_path 14_nms_box_gather_nd.onnx

sor4onnx \
--input_onnx_file_path 14_nms_box_gather_nd.onnx \
--old_new "serving_default_input_1" "gn_boxes" \
--output_onnx_file_path 14_nms_box_gather_nd.onnx \
--mode inputs

sor4onnx \
--input_onnx_file_path 14_nms_box_gather_nd.onnx \
--old_new "serving_default_input_2" "gn_box_selected_indices" \
--output_onnx_file_path 14_nms_box_gather_nd.onnx \
--mode inputs

sor4onnx \
--input_onnx_file_path 14_nms_box_gather_nd.onnx \
--old_new "PartitionedCall" "final_boxes" \
--output_onnx_file_path 14_nms_box_gather_nd.onnx \
--mode outputs

python make_input_output_shape_update.py \
--input_onnx_file_path 14_nms_box_gather_nd.onnx \
--output_onnx_file_path 14_nms_box_gather_nd.onnx \
--input_names gn_boxes \
--input_names gn_box_selected_indices \
--input_shapes ${BATCHES} ${BOXES} 4 \
--input_shapes N 2 \
--output_names final_boxes \
--output_shapes N 4

onnxsim 14_nms_box_gather_nd.onnx 14_nms_box_gather_nd.onnx
onnxsim 14_nms_box_gather_nd.onnx 14_nms_box_gather_nd.onnx


################################################### nms_yolox_xxx_nd + nms_final_batch_nums_final_class_nums_final_box_nums
snc4onnx \
--input_onnx_file_paths 09_nms_yolox_${BOXES}_nd.onnx 13_nms_final_batch_nums_final_class_nums_final_box_nums.onnx \
--srcop_destop workaround_mul_out bc_input \
--op_prefixes_after_merging main01 sub01 \
--output_onnx_file_path 15_nms_yolox_${BOXES}_split.onnx



################################################### nms_yolox_${BOXES}_split + nms_box_gather_nd
snc4onnx \
--input_onnx_file_paths 15_nms_yolox_${BOXES}_split.onnx 14_nms_box_gather_nd.onnx \
--srcop_destop x1y1x2y2 gn_boxes final_box_nums gn_box_selected_indices \
--output_onnx_file_path 16_nms_yolox_${BOXES}_merged.onnx

onnxsim 16_nms_yolox_${BOXES}_merged.onnx 16_nms_yolox_${BOXES}_merged.onnx
onnxsim 16_nms_yolox_${BOXES}_merged.onnx 16_nms_yolox_${BOXES}_merged.onnx



################################################### nms output merge
python make_nms_outputs_merge.py

onnxsim 17_nms_batchno_classid_x1y1x2y2_cat.onnx 17_nms_batchno_classid_x1y1x2y2_cat.onnx


################################################### merge
snc4onnx \
--input_onnx_file_paths 16_nms_yolox_${BOXES}_merged.onnx 17_nms_batchno_classid_x1y1x2y2_cat.onnx \
--srcop_destop final_batch_nums cat_batch final_class_nums cat_classid final_scores cat_score final_boxes cat_x1y1x2y2 \
--output_onnx_file_path 18_nms_yolox_${BOXES}.onnx

onnxsim 18_nms_yolox_${BOXES}.onnx 18_nms_yolox_${BOXES}.onnx


################################################### yolox + Post-Process
snc4onnx \
--input_onnx_file_paths yolox_nano.onnx 18_nms_yolox_${BOXES}.onnx \
--srcop_destop output predictions \
--output_onnx_file_path naruto_handsign_detection_yolox_nano_post.onnx
onnxsim naruto_handsign_detection_yolox_nano_post.onnx naruto_handsign_detection_yolox_nano_post.onnx
onnxsim naruto_handsign_detection_yolox_nano_post.onnx naruto_handsign_detection_yolox_nano_post.onnx

################################################### cleaning
rm 0*_*.onnx
rm 1*_*.onnx
