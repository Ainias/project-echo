#!/bin/bash

cd src/client/img

sizes=(180 120 60 76 152 40 80 57 114 72 144 167 29 58 87 50 100 167)

for size in ${sizes[*]}; do

convert logo.png -resize $size ios/${size}.png
echo '<icon src="src/client/img/ios/'${size}'.png" width="'${size}'" height="'${size}'" />'

done
