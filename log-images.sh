#!/bin/bash

sizeFile="./src/imageSizes.js"
subdirs="sm md lg xl xxl xxxl xxxxl"

echo "export const imageSizes = {" > "$sizeFile"

for sd in $subdirs; do
	d="./public/images/${sd}/*.png"
	echo "  ${sd}: {" >> "$sizeFile"
	for img in $d; do
		[ -f "$img" ] || continue;
		bn="$(basename "$img")"
		name="${bn%%.*}"
		dims=$(identify "$img" | cut -d " " -f3)
		width="${dims%%x*}"
		height="${dims#*x}"
		echo "    '${name}': { width: ${width}, height: ${height} }," >> "$sizeFile"
	done
	echo "  }," >> "$sizeFile"
done

echo "}" >> "$sizeFile"
