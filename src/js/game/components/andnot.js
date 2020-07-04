import { gItemRegistry } from "../../core/global_registries";
import { types } from "../../savegame/serialization";
import { Component } from "../component";
import { BaseItem } from "../base_item";

export class AndnotComponent extends Component {
    static getId() {
        return "Andnot";
    }

    static getSchema() {
        return {
            items: types.array(
                types.structured({
                    item: types.obj(gItemRegistry),
                    slot: types.uint,
                })
            ),
            blocking: types.float,
            intervals: types.array(types.float),
        };
    }

    duplicateWithoutContents() {
        return new AndnotComponent({});
    }

    /**
     *
     * @param {object} param0
     *
     */
    constructor({}) {
        super();

        /** @type {Array<{item: BaseItem, slot: number}>} */
        this.items = [];

        /** @type {number} */
        this.blocking = 0;

        /** @type {Array<number>} */
        this.intervals = [0, 0, 0];
    }

    /**
     * Tries to take the item
     * @param {BaseItem} item
     * @param {number} slot
     */
    tryTakeItem(item, slot) {
        if (this.items.some(item => item.slot === slot)) {
            return false;
        }

        this.items.push({ item, slot });
        return true;
    }
}
