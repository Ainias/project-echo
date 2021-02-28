#!/bin/bash

cd src/client/img

sizes=(20 24 27.5 29 40 42 44 50 57 58 60 72 76 80 86 87 98 100 108 114 120 144 152 167 180 1024)

for size in ${sizes[*]}; do

convert logo.png -resize $size ios/${size}.png
echo '<icon src="src/client/img/ios/'${size}'.png" width="'${size}'" height="'${size}'" />'

done
