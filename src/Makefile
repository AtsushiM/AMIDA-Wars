SRC = js/namespace_start.js js/private_val.js js/const.js js/public_init.js js/randam_map.js js/race_select.js js/const.js js/amida.js js/castle.js js/thumb.js js/unit.js js/score.js js/countdown.js js/effect.js js/enemy_action.js js/battle.js js/surveillant.js js/status_viwer.js js/log.js js/result.js js/namespace_end.js js/init.js
TEMP = amidawars.js
COMPRESS = amidawars.min.js
COMBINE = aw.js
 
$(TEMP) : $(SRC)
	cat $^ > $@

	growlnotify -t 'auto-make' -m 'make start.'
	((java -jar /Applications/gcc/compiler.jar --js $(TEMP) --js_output_file $(COMPRESS)) && growlnotify -t 'auto-make' -m 'make complete.') || growlnotify -t 'auto-make' -m 'make error.'
	cat enchant/enchant.min.js enchant/plugins/nineleap.enchant.min.js $(COMPRESS) > $(COMBINE)

 
.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

