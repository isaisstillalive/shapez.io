import { DrawParameters } from "../../core/draw_parameters";
import { types } from "../../savegame/serialization";
import { BaseItem, enumItemType } from "../base_item";
import { ShapeItem } from "./shape_item";
import { ColorItem } from "./color_item";
import { THEME } from "../theme";

export class BundleItem extends BaseItem {
    static getId() {
        return "bundle";
    }

    static getSchema() {
        return types.structured({
            item: types.string,
            itemType: types.string,
            quantity: types.uint,
        });
    }

    serialize() {
        return {
            item: this.item.serialize(),
            itemType: this.item.getItemType(),
            quantity: this.quantity,
        };
    }

    deserialize(data) {
        if (data.itemType == enumItemType.shape) {
            this.item = new ShapeItem(null);
        } else if (data.itemType == enumItemType.color) {
            this.item = new ColorItem(null);
        } else {
            this.item = new ShapeItem(null);
        }
        this.item.deserialize(data.item);
        this.quantity = data.quantity;
    }

    getItemType() {
        return enumItemType.bundle;
    }

    /**
     * @param {BaseItem} item
     * @param {number} quantity
     */
    constructor(item, quantity) {
        super();

        /**
         * This property must not be modified on runtime, you have to clone the class in order to change the definition
         */
        this.item = item;
        this.quantity = quantity;
    }

    getBackgroundColorAsResource() {
        return THEME.map.resources.shape;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {DrawParameters} parameters
     * @param {number=} size
     */
    draw(x, y, parameters, size) {
        this.item.draw(x, y - 2, parameters, size);
        this.item.draw(x, y, parameters, size);
        this.item.draw(x, y + 2, parameters, size);
    }
}
