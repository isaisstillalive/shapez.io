import { Component } from "../component";
import { types } from "../../savegame/serialization";
import { gItemRegistry } from "../../core/global_registries";
import { BaseItem, enumItemType } from "../base_item";
import { ShapeItem } from "../items/shape_item";

export class BundlerComponent extends Component {
    static getId() {
        return "Bundler";
    }

    static getSchema() {
        return {
            storedCount: types.uint,
            storedItem: types.nullable(types.obj(gItemRegistry)),
        };
    }

    duplicateWithoutContents() {
        return new BundlerComponent({});
    }

    /**
     * @param {object} param0
     */
    constructor({}) {
        super();

        /**
         * Currently stored item
         * @type {BaseItem}
         */
        this.storedItem = null;

        /**
         * How many of this item we have stored
         * @type {number}
         */
        this.storedCount = 0;
    }

    /**
     * Returns whether this storage can accept the item
     * @param {BaseItem} item
     */
    canAcceptItem(item) {
        if (this.storedCount >= 10) {
            return false;
        }
        if (!this.storedItem || this.storedCount === 0) {
            return true;
        }

        const itemType = item.getItemType();

        // Check type matches
        if (itemType !== this.storedItem.getItemType()) {
            return false;
        }

        if (itemType === enumItemType.color) {
            return false;
            // return /** @type {ColorItem} */ (this.storedItem).color === /** @type {ColorItem} */ (item).color;
        }

        if (itemType === enumItemType.shape) {
            return (
                /** @type {ShapeItem} */ (this.storedItem).definition.getHash() ===
                /** @type {ShapeItem} */ (item).definition.getHash()
            );
        }
        return false;
    }

    /**
     * @param {BaseItem} item
     */
    takeItem(item) {
        this.storedItem = item;
        this.storedCount++;
    }
}
