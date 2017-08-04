module.exports = {
  /**
		 * Utility to create a new function that keeps
		 * track of its call count. Get call counts to
     * it via [newFunction].getCallCount().
		 * @param {Function} Target function to track call counts. 
		 * @returns {Function} The new function.
		 */
		addCallCount: (fn) => {
			let cnt = 0;
			return function newFn(...args) {
				fn.apply(null ,args);
				cnt += 1;
				newFn.getCallCount = () => cnt;
			}
		}
};