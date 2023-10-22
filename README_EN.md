
---
# NARUTO-HandSignDetection
This is a model and sample program that detects the Naruto' hand sign using object detection.
<!--
![header](https://user-images.githubusercontent.com/37477845/95489808-4fb55c80-09d2-11eb-95f0-c3cdc6d55d83.png)
-->
<div align="left">

<img src="https://user-images.githubusercontent.com/37477845/95489944-78d5ed00-09d2-11eb-96f6-a687b012c413.gif" width="45%">　<img src="https://user-images.githubusercontent.com/37477845/95645297-97360880-0af8-11eb-9134-d92cbfb5fe42.gif" width="40%"><!--　<img src="https://user-images.githubusercontent.com/37477845/95490010-93a86180-09d2-11eb-8185-e50fd2b5c137.gif" width="45%">--><br>
Right figure：© NARUTO Episode 9 『Kakashi, Sharingan Warrior!』Masashi Kishimoto/Shueisha/Studio Pierrot<br>
※The bounding box is not overlaid in the figure on the right because it may correspond to "modification" in <span id="cite_ref-1">Article 20 "Identity Preservation Right" of the Japanese Copyright Law</span><sup>[1](#cite_note-1)</sup>.

<!-- ![21](https://user-images.githubusercontent.com/37477845/95489944-78d5ed00-09d2-11eb-96f6-a687b012c413.gif)![22](https://user-images.githubusercontent.com/37477845/95490010-93a86180-09d2-11eb-8185-e50fd2b5c137.gif) -->
</div>
<!--
![footer](https://user-images.githubusercontent.com/37477845/95489817-5348e380-09d2-11eb-9df0-3ddd06703c55.png)
-->

---

# Title
Deep(Sharingan)：Development of NARUTO's Hand Sign Recognition System using Object Detection YOLOX

# Abstract
This repository publishes trained models and sample programs for recognizing the <span id="cite_ref-2">Naruto’s</span><sup>[2](#cite_note-2)</sup> hand sign.

With the exception of some ninjutsu, the activation of 忍術(ninjutsu) requires a hand-signs.<br>
In addition, because the characteristics of the property change appear in the hand-sign (Fire Style → Tiger's mark, Earth Style → Boar's mark, etc.)<br>
If you can recognize the hand-sign quickly, you can gain an advantage in the battle between Shinobi.
By using YOLOX-Nano, one of the deep learning object detection models, for hand-sign recognition,<br>
The speed has been greatly improved compared to the Deep写輪眼(using EfficientDet-D0) that was created on a basis in the past.<br>

<!--# Introduction
-->
# Requirements
* onnxruntime 1.10.0 or Later
* OpenCV 3.4.2 or Later
* Pillow 6.1.0 or Later (Only when running Ninjutsu_demo.py)
* Tensorflow 2.3.0 or Later (Only when running SSD or EfficientDet, or only when merging post-processing into ONNX)

# DataSet
### About the dataset
The dataset is private(trained models are public)<br>
※Follow <span id="cite_ref-3">Article 47-7 of the Copyright Act of Japan "Transfer of reproductions made due to restrictions on reproduction rights"</span><sup>[3](#cite_note-3)</sup>

In addition to the images I took and the anime images, I use <span id="cite_ref-4">naruto-hand-sign-dataset</span><sup>[4](#cite_note-4)</sup>.

### Request
Since the dataset consists of images collected on the Internet and images taken by ourselves, <br>
Depending on the background color and clothing, the detection accuracy may drop or false detection may occur. <br>
It would be helpful if you could tell us the conditions that were falsely detected in the Issue. <br>
If possible, it would be greatly appreciated if you could provide an image of the conditions for false detection(Rat-Boar, Mizunoe, Hand Claps). <br>
At that time, the received image will be added to the training data set and used for retraining the model.

### Kind of hand-sign
It corresponds to 14 kinds of hand-signs(Rat-Boar, Mizunoe, Hand Claps).<br>

<table>
	<tbody>
		<tr>
			<td width="25%">子(Ne/Rat)</td>
			<td width="25%">丑(Ushi/Ox)</td>
			<td width="25%">寅(Tora/Tiger)</td>
			<td width="25%">卯(U/Hare)</td>
		</tr>
		<tr>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611897-6d032d00-0a9d-11eb-86c4-de1c50c0d7b6.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611906-6ffe1d80-0a9d-11eb-9054-4e68c42e52ca.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611912-712f4a80-0a9d-11eb-8cb8-fc7097e16f60.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611915-72607780-0a9d-11eb-9995-66524ce4f978.jpg" width="100%"></td>
		</tr>
	</tbody>
</table>
<table>
	<tbody>
		<tr>
			<td width="25%">辰(Tatsu/Dragon)</td>
			<td width="25%">巳(Mi/Snake)</td>
			<td width="25%">午(Uma/Horse)</td>
			<td width="25%">未(Hitsuji/Ram)</td>
		</tr>
		<tr>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611920-7391a480-0a9d-11eb-8e74-db39acf90f83.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611922-742a3b00-0a9d-11eb-8a21-8bdf207db9bb.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611928-755b6800-0a9d-11eb-86c0-67605ffd6e9b.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611930-768c9500-0a9d-11eb-81c6-067b632dc43d.jpg" width="100%"></td>
		</tr>
	</tbody>
</table>
<table>
	<tbody>
		<tr>
			<td width="25%">申(Saru/Monkey)</td>
			<td width="25%">酉(Tori/Bird)</td>
			<td width="25%">戌(Inu/Dog)</td>
			<td width="25%">亥(I/Boar)</td>
		</tr>
		<tr>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611931-77252b80-0a9d-11eb-97d6-e3efc6f1aac3.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611935-77bdc200-0a9d-11eb-95e1-feb8bf7f61de.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611936-78eeef00-0a9d-11eb-90b3-f565e4763c50.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611938-7a201c00-0a9d-11eb-9d5f-1daf2405f20f.jpg" width="100%"></td>
		</tr>
	</tbody>
</table>
<table>
	<tbody>
		<tr>
			<td width="25%">the ninth of the ten Heavenly Stems(Mizunoe)</td>
			<td width="25%">palms together(Gassho/Hand Claps)</td>
			<td width="25%">-</td>
			<td width="25%">-</td>
		</tr>
		<tr>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611947-7c827600-0a9d-11eb-97ae-9d7eabc58cd5.jpg" width="100%"></td>
			<td><img src="https://user-images.githubusercontent.com/37477845/95611943-7b514900-0a9d-11eb-97be-4fda80d17879.jpg" width="100%"></td>
			<td></td>
			<td></td>
		</tr>
	</tbody>
</table>

### Number of datasets
Total number：10026 sheets(Anime image：2651sheets)<br>
Number of tagged sheets：7098sheets<br>
Number of untagged sheets：2928sheets<br>
Number of annotation boxes：8941 boxes<br>
<img src="https://user-images.githubusercontent.com/37477845/163701957-529d7510-88e4-420f-8099-5dd6f6d9a8cf.png" width="35%">　<img src="https://user-images.githubusercontent.com/37477845/163701962-a4818eba-3b4f-4c92-a7b9-f2331b7f3f23.png" width="50%">

# Trained Model
The trained model is published under the 'model' directory. * Move the old version model to the "_legacy" directory.
* YOLOX-Nano

# Directory
<pre>
│  simple_demo.py
│  Ninjutsu_demo.py
│
├─model
│  └─yolox
│      │ yolox_nano.onnx
│      └─yolox_onnx.py
│
├─post_process_gen_tools
│      │ convert_script.sh
│      │ make_box_gather_nd.py
│      │ make_boxes_scores.py
│      │ make_cxcywh_y1x1y2x2.py
│      │ make_final_batch_nums_final_class_nums_final_box_nums.py
│      │ make_grids.py
│      │ make_input_output_shape_update.py
│      │ make_nms_outputs_merge.py
│      └─make_score_gather_nd.py
│
├─setting─┬─labels.csv
│         └─jutsu.csv
│
├─utils
│
└─_legacy
</pre>
#### simple_demo.py
　A simple detection demo.<br>
　<img src="https://user-images.githubusercontent.com/37477845/95647513-06b4f380-0b0b-11eb-8caf-5cb092ccdb66.jpg" width="35%">

#### Ninjutsu_demo.py
　This is a demonstration of the establishment of Ninjutsu.<br>
　The Ninjutsu name that matches the Ninjutsu-data(jutsu.csv) from the history of the hand-sign is displayed.<br>
　<img src="https://user-images.githubusercontent.com/37477845/95490010-93a86180-09d2-11eb-8185-e50fd2b5c137.gif" width="35%">
　<!--<img src="https://user-images.githubusercontent.com/37477845/95647523-13394c00-0b0b-11eb-935b-a5a94e2f523d.jpg" width="35%">-->

#### model
　Contains trained models.

#### setting
　Contains label data(labels.csv) and Ninjutsu name data(jutsu.csv).
* labels.csv<br>
The label name of the hand-sign is listed<br>
    * Column A：English hand-sign name
    * Column B：Japanese hand-sign name
* jutsu.csv<br>
The name of the Ninjutsu name and the required hand-sign are listed.<br>
    * Column A：Japanese technique type name(Fire Style, etc)
    * Column B：English technique type name(Fire Style, etc)
    * Column C：Japanese Ninjutsu name
    * Column D：English Ninjutsu name
    * After column E：Hand-signs required to activate ninjutsu

#### utils
 Contains the FPS measurement module(cvfpscalc.py) and the character string drawing module(cvdrawtext.py). <br>
 Used only in Ninjutsu_demo.py.

# Usage
Here's how to run the demo.
```bash
python simple_demo.py
python simple_demo_without_post.py
python Ninjutsu_demo.py
```

In addition, the following options can be specified when running the demo.
<details>
<summary>Option specification</summary>

* --device<br>
Camera device number<br>
Default：
    * simple_demo.py：0
    * Ninjutsu_demo.py：0
* --file<br>
Video file name ※If specified, the video will be loaded in preference to the camera<br>
Default：
    * simple_demo.py：None
    * Ninjutsu_demo.py：None
* --fps<br>
Processing FPS ※Valid only if the inference time is less than FPS<br>
Default：
    * simple_demo.py：10
    * Ninjutsu_demo.py：10
* --width<br>
Width when shooting with a camera<br>
Default：
    * simple_demo.py：960
    * Ninjutsu_demo.py：960
* --height<br>
Height when shooting with a camera<br>
Default：
    * simple_demo.py：540
    * Ninjutsu_demo.py：540
* --skip_frame<br>
Whether to thin out when loading the camera or video<br>
Default：
    * simple_demo.py：0
    * Ninjutsu_demo.py：0
* --model<br>
Storage path of the model to load<br>
Default：
    * simple_demo.py：model/yolox/yolox_nano.onnx
    * Ninjutsu_demo.py：model/yolox/yolox_nano.onnx
* --input_shape<br>
Model input shape<br>
Default：
    * simple_demo.py：416,416
    * Ninjutsu_demo.py：416,416
* --score_th<br>
Class discrimination threshold<br>
Default：
    * simple_demo.py：0.7
    * Ninjutsu_demo.py：0.7
* --nms_th<br>
NMS threshold<br>
Default：
    * simple_demo.py：0.45
    * Ninjutsu_demo.py：0.45
* --nms_score_th<br>
NMS score threshold<br>
Default：
    * simple_demo.py：0.1
    * Ninjutsu_demo.py：0.1
* --sign_interval<br>
The hand-sign history is cleared when the specified time(seconds) has passed since the last mark was detected.<br>
Default：
    * Ninjutsu_demo.py：2.0
* --jutsu_display_time<br>
Time to display the Ninjutsu name when the hand-sign procedure is completed(seconds)<br>
Default：
    * Ninjutsu_demo.py：5
* --use_display_score<br>
Whether to display the hand-sign detection score<br>
Default：
    * Ninjutsu_demo.py：False
* --erase_bbox<br>
Whether to clear the bounding box overlay display<br>
Default：
    * Ninjutsu_demo.py：False
* --use_jutsu_lang_en<br>
Whether to use English notation for displaying the Ninjutsu name<br>
Default：
    * Ninjutsu_demo.py：False
* --chattering_check<br>
Continuous detection is regarded as hand-sign detection<br>
Default：
    * Ninjutsu_demo.py：1
* --use_fullscreen<br>
Whether to use full screen display(experimental function)<br>
Default：
    * Ninjutsu_demo.py：False
</details>

# Application Example
Here are some application examples.
* [15th UE4 Petit Con “VADERS”](https://www.youtube.com/watch?v=K4-E5SseVtI)
<!--
This is an application example.
|Shinobi authentication system|Ninja Academy Exam|Deep Sharingan Smart glass|
|:---:|:---:|:---:|
|<img src="https://user-images.githubusercontent.com/37477845/95650546-3a9a1400-0b1f-11eb-9b80-c58256b268a3.gif" width="100%">|<img src="https://user-images.githubusercontent.com/37477845/95650553-44237c00-0b1f-11eb-8a85-7e5e72e80120.gif" width="100%">|<img src="https://user-images.githubusercontent.com/37477845/95650659-d9267500-0b1f-11eb-90d7-d82cdb2c2824.png" width="100%">|
-->

# Acknowledgements
During the EfficientDet model training, I referred to karaage-san <span id="cite_ref-5">explanation article</span><sup>[5](#cite_note-5)</sup>. <br>
Also, Karaage-san introduced Deep Sharingan on his <span id="cite_ref-6">blog</span><sup>[6](#cite_note-6)</sup>.<br>
Thank you very much.<br><br>
I use <span id="cite_ref-7">YOLOX-Colaboratory-Training-Sample</span><sup>[7](#cite_note-7)</sup> for YOLOX training.

# References
1. [^](#cite_ref-1)<span id="cite_note-1">Japan：[Copyright Law Article 20 "Right to maintain identity"](https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=345AC0000000048#183)</span>
1. [^](#cite_ref-2)<span id="cite_note-2">『[NARUTO](https://www.shonenjump.com/j/rensai/naruto.html)』Masashi Kishimoto/Shueisha 1999-2014</span>
1. [^](#cite_ref-3)<span id="cite_note-3">Japan：[Copyright Act Article 47-7 "Transfer of reproductions made due to restrictions on reproduction rights"](https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=345AC0000000048#407)</span>
1. [^](#cite_ref-4)<span id="cite_note-4">Kaggle Public dataset：[naruto-hand-sign-dataset](https://www.kaggle.com/vikranthkanumuru/naruto-hand-sign-dataset)</span>
1. [^](#cite_ref-5)<span id="cite_note-5">Karaage-san's blog：[「Object Detection API」How to learn your own data for object detection with（TensorFlow 2.xVersion）](https://qiita.com/karaage0703/items/8567cc192e151bac3e50)</span>
1. [^](#cite_ref-6)<span id="cite_note-6">Karaage-san's blog：[AIでNARUTO気分！「Deep Let's play with "Sharingan"](https://karaage.hatenadiary.jp/entry/2020/10/16/073000)</span>
1. [^](#cite_ref-7)<span id="cite_note-7">[Kazuhito00/YOLOX-Colaboratory-Training-Sample](https://github.com/Kazuhito00/YOLOX-Colaboratory-Training-Sample)</span>

# Authors
Chandra prakash Pandey(https://www.linkedin.com/in/chandra-prakash-pandey-536564256/)

<!--
# Affiliations
-->

# License
NARUTO-HandSignDetection is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

# License(Font)
KouzanMouhitsu(Hengshan brush) Font(https://opentype.jp/kouzanmouhitufont.htm)
