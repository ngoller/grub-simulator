export class ObjectPool {
    constructor(createFunc, initialSize = 10) {
        this.createFunc = createFunc; // Function to create a new object
        this.pool = [];
        this.expandPool(initialSize);
    }

    expandPool(size) {
        for (let i = 0; i < size; i++) {
            this.pool.push(this.createFunc());
        }
    }

    acquire() {
        if (this.pool.length === 0) {
            this.expandPool(5); // Expand pool by a certain number if empty
        }
        return this.pool.pop();
    }

    release(object) {
        // add generic resetting
        this.pool.push(object);
    }
}