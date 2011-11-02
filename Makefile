SRC = src/namespace_start.js src/private_val.js src/const.js src/res_start.js src/namespace_end.js src/init.js
COMBINE = init.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@
 
.PHONY: clean
clean :
	rm -f $(COMBINE) 
