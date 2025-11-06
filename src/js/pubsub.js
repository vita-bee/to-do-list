// PubSub Module to mediate events
export const PubSub = (function() {
    const events = {};
    function subscribe(event, callback) {
        if (typeof callback !== 'function') {throw new Error('Callback must be a function');}
        if (!events[event]) {events[event] = [];}
        // Prevent duplicate subscriptions
        if (!events[event].includes(callback)) {events[event].push(callback);}
    }
    function publish(event, data) {
        if (events[event]) {events[event].forEach(callback => callback(data));}
    }
    function unsubscribe(event, callback) {
        if (events[event]) {events[event] = events[event].filter(cb => cb !== callback);}
    }
    return {subscribe, publish, unsubscribe};
})();