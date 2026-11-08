#!/bin/bash
# redraw chunk 0 of each Short with Ricky's face on the opening frame, then reassemble
cd "$(dirname "$0")"
run(){ T=$1; C=$2; TL=$3; CH=$4; MIX=$5; OUT=$6
  mkdir -p ${CH}_old; [ -f $CH/c0000.mp4 ] && mv $CH/c0000.mp4 ${CH}_old/c0000_nocover.mp4
  VERT=1 SHORT=1 COVER=$C TLFILE=$TL CHUNKS=$CH node run.js chunks 0 3 > log_cov_$T.txt 2>&1
  ls $CH/c????.mp4 | sed "s#^$CH/##;s/^/file '/;s/\$/'/" > $CH/list.txt
  ffmpeg -loglevel error -y -f concat -safe 0 -i $CH/list.txt -c copy v_$T.mp4 && ffmpeg -loglevel error -y -i v_$T.mp4 -i $MIX -map 0:v -map 1:a -c:v libx264 -preset medium -crf 21 -tune animation -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest week1/$OUT && echo "$OUT done"; }
run s8b h_disgusted tl_s8b.json chunks_s8b mix_s8bn.wav 1-Sat-wombats.mp4 &
run r2 h_thinking tl_s2.json chunks_r2 mix_r2n.wav 2-Sun-google.mp4 &
run r4 h_shocked tl_s4.json chunks_r4 mix_r4n.wav 3-Mon-cloud.mp4 &
wait
run r3 h_skeptical tl_s3.json chunks_r3 mix_r3n.wav 4-Tue-dolphins.mp4 &
run r7 h_thinking tl_s7.json chunks_r7 mix_r7n.wav 5-Wed-astronauts.mp4 &
run r1 h_shocked tl_s1.json chunks_r1 mix_r1n.wav 6-Thu-finland.mp4 &
wait
run r5 h_skeptical tl_s5.json chunks_r5 mix_r5n.wav spare-shortest-war.mp4
