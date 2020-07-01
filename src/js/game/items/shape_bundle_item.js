import { DrawParameters } from "../../core/draw_parameters";
import { types } from "../../savegame/serialization";
import { BaseItem, enumItemType } from "../base_item";
import { ShapeDefinition } from "../shape_definition";
import { THEME } from "../theme";

export class ShapeBundleItem extends BaseItem {
    static getId() {
        return "shape_bundle";
    }

    static getSchema() {
        return types.structured({
            definition: types.string,
            quantity: types.uint,
        });
    }

    serialize() {
        return {
            definition: this.definition.getHash(),
            quantity: this.quantity,
        };
    }

    deserialize(data) {
        this.definition = ShapeDefinition.fromShortKey(data.definition);
        this.quantity = data.quantity;
    }

    getItemType() {
        return enumItemType.shapeBundle;
    }

    /**
     * @param {ShapeDefinition} definition
     * @param {number} quantity
     */
    constructor(definition, quantity) {
        super();
        // logger.log("New shape item for shape definition", definition.generateId(), "created");

        /**
         * This property must not be modified on runtime, you have to clone the class in order to change the definition
         */
        this.definition = definition;
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
        this.definition.draw(x, y - 2, parameters, size);
        this.definition.draw(x, y - 1, parameters, size);
        this.definition.draw(x, y, parameters, size);
    }
}
