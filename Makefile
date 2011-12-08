SRC = src/namespace_start.js src/private_val.js src/const.js src/public_init.js src/randam_map.js src/race_select.js src/const.js src/amida.js src/castle.js src/thumb.js src/unit.js src/score.js src/countdown.js src/effect.js src/enemy_action.js src/battle.js src/surveillant.js src/status_viwer.js src/log.js src/result.js src/namespace_end.js src/init.js
COMBINE = amidawars.js
COMPRESS = amidawars.min.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@

	java -jar /Applications/gcc/compiler.jar --js $(COMBINE) --js_output_file $(COMPRESS)
 
.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

