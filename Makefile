SRC = src/namespace_start.js src/private_val.js src/const.js src/public_init.js src/public_const.js src/public_amida.js src/public_castle.js src/public_thumb.js src/public_unit.js src/public_score.js src/public_countdown.js src/public_effect.js src/enemy_action.js src/battle.js src/surveillant.js  src/namespace_end.js src/init.js
COMBINE = amidawars.js
COMPRESS = amidawars.min.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@

	java -jar /Applications/gcc/compiler.jar --js $(COMBINE) --js_output_file $(COMPRESS)
 
.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

