var HashSet = require('hashset');
// HashCollector.prototype.
module.exports = HashCollector;

/**
 * @class StateDB
 * @param method hash collecting implementation:
 * -set
 * -hashSet
 * -lastPath
 * -none
 */
function HashCollector(method = undefined) {
    var self = this;
    self.method = method === undefined ? 'hashSet' : method;
    switch (self.method) {
        case 'set':
            self.prevMap = new Set(); // add to map
            self.helpMap = new Set(); // add to map
            break;
        case 'hashSet':
            self.prevMap = new HashSet(); // add to map
            self.helpMap = new HashSet(); // add to map
            break;
        case 'lastPath':
            self.visitedDepth = [];
            self.visitedStack = [];
            self.expectedWorldDepth = [];
            self.expectedWorldStack = [];
            self.expectedStorageDepth = [];
            self.expectedStorageStack = [];
            break;
        case 'none':
            break;
    }
}

HashCollector.prototype.newBlock = function () {
    var self = this;
    switch (self.method) {
        case 'set':
            self.helpMap = new Set(); // add to map
            break;
        case 'hashSet':
            self.helpMap = new HashSet(); // add to map
            break;
        case 'lastPath':
            self.tree = 'world';
            self.visitedDepth = [];
            self.visitedStack = [];
            self.expectedDepth = self.expectedWorldDepth;
            self.expectedStack = self.expectedWorldStack;
            break;
        case 'none':
            break;
    }
    return self;
};

// finds first index in items with value greater than value
function binarySearch(items, value) {

    var startIndex = 0,
        stopIndex = items.length - 1,
        middle = Math.floor((stopIndex + startIndex) / 2);

    while (items[middle] !== value && startIndex < stopIndex) {

        //adjust search area
        if (value < items[middle]) {
            stopIndex = middle - 1;
        } else if (value > items[middle]) {
            startIndex = middle + 1;
        }

        //recalculate middle
        if (startIndex < stopIndex) {
            middle = Math.floor((stopIndex + startIndex) / 2);
        }
    }

    //make sure it's the right value
    return middle + 1;
}

HashCollector.prototype.addHash = function (rootHash, depth) {
    var self = this;
    switch (self.method) {
        case 'set':
            self.prevMap.add(rootHash.toString('hex')); // add to map
            self.helpMap.add(rootHash.toString('hex')); // add to map
            break;
        case 'hashSet':
            self.prevMap.add(rootHash.toString('hex')); // add to map
            self.helpMap.add(rootHash.toString('hex')); // add to map
            break;
        case 'lastPath':
            if (depth > self.expectedDepth[0]) { // new end
                var index = binarySearch(self.expectedDepth, depth);
                self.expectedDepth = self.expectedDepth.splice(index, self.expectedDepth.length - 1);
                self.expectedStack = self.expectedStack.splice(index, self.expectedStack.length - 1);
            }
            self.visitedDepth.push(depth);
            self.visitedStack.push(rootHash);
            break;
        case 'none':
            break;
    }
    return self;
};

HashCollector.prototype.checkHash = function (rootHash, depth) {
    var self = this;
    switch (self.method) {
        case 'set':
            return self.prevMap.has(rootHash.toString('hex'));
        case 'hashSet':
            return self.prevMap.contains(rootHash.toString('hex'));
        case 'lastPath':
            if (self.expectedDepth.length === 0 || self.expectedStack.length === 0) return false;
            else if (rootHash.equals(self.expectedStack[0])) {
                self.expectedDepth = self.visitedDepth.concat(self.expectedDepth);
                self.expectedStack = self.visitedStack.concat(self.expectedStack);
                return true;
            }
            else return false;
        case 'none':
            return false;
    }
};

HashCollector.prototype.goStorage = function (rootHash, depth) {
    var self = this;
    switch (self.method) {
        case 'set':
            break;
        case 'hashSet':
            break;
        case 'lastPath':
            self.tree = 'storage';
            self.expectedWorldDepth = self.visitedDepth;
            self.expectedWorldStack = self.visitedStack;
            self.visitedDepth = [];
            self.visitedStack = [];
            self.expectedDepth = self.expectedStorageDepth;
            self.expectedStack = self.expectedStorageStack;
            break;
        case 'none':
            break;
    }
    return self;
};

HashCollector.prototype.foundNew = function () {
    var self = this;
    switch (self.method) {
        case 'set':
            self.prevMap = self.helpMap;
            break;
        case 'hashSet':
            self.prevMap = self.helpMap;
            break;
        case 'lastPath':
            self.expectedStorageDepth = self.visitedDepth;
            self.expectedStorageStack = self.visitedStack;
            break;
        case 'none':
            break;
    }
    return self;
};
