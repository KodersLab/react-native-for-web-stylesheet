// create an array with available characters to be used as a className
const CHARS = 'qwertyuiopasdfghjklzxcvbnm_'.split('');
const CHARS_NUM = CHARS.length;

export default () => {
	// store the next index
	var nextIndex = [0];
	// returns the function that gives a new id
	return () => {
		// calculate the new id
		var id = nextIndex.map(i => CHARS[i]).join('');
		// did all the characters reached the last available character?
		var shouldReset = nextIndex.filter(i => i === CHARS_NUM -1).length === nextIndex.length;
		// if so, we reset. by resetting we restart with all zeros and we increment the id length
		if(shouldReset){
			var newLength = nextIndex.length + 1;
			nextIndex = [];
			for(var i = 0; i < newLength; i++){
				nextIndex.push(0);
			}
		// if not, increment the first non zero character
		}else{
			for(var i = 0; i < nextIndex.length; i++){
				nextIndex[i] = ++nextIndex[i] % CHARS_NUM;
				if(nextIndex[i]) break;
			}
		}
		// return the id
		return id;
	};
};
