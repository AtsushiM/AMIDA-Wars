var observer = {
	subscribers: {
		UNIT: {
			USER:{},
			ENEMY:{}
		},
		THUMB: {
			USER:{},
			ENEMY:{}
		},
		CASTLE: {
			USER:{},
			ENEMY:{}
		}
	},
	methods: {
		UNIT: {
			kill:[
				function(){
					//damage castle
					console.log('damage castle');
				},
				function(){
					//update score
					console.log('update score unit');
				}
			]
		},
		THUMB: {
			thouchEnd:[
				function(){
					//create unit 
					console.log('create unit');
				}
			]
		},
		CASTLE: {
			broke:[
				function(){
					//update score
					console.log('update score castle');
				}
			]
		}
	},
	register: function(that,state){
		// TODO: methods
	},
	update: function(that,action){
		var type = that.type,
			mode = that.mode,
			i = 0,
			targets = subscribers[type][mode],
			method = methods[type];

		for(i in targets){
			if(targets.hasOwnProperties(i)){
			}
		}
		Observer.methods[that.className][action](that);
	}
};
