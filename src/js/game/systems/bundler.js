import { GameSystemWithFilter } from "../game_system_with_filter";
import { BundlerComponent } from "../components/bundler";
import { enumLayer } from "../root";
import { BundleItem } from "../items/bundle_item";
import { NEGATIVE_ENERGY_ITEM_SINGLETON } from "../items/negative_energy_item";

export class BundlerSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [BundlerComponent]);
    }

    update() {
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];
            const bundlerComp = entity.components.Bundler;

            if (bundlerComp.storedItem && bundlerComp.storedCount == 10 && bundlerComp.energy >= 1) {
                const ejectorComp = entity.components.ItemEjector;

                const nextSlot = ejectorComp.getFirstFreeSlot(enumLayer.regular);
                const negativeSlot = ejectorComp.getFirstFreeSlot(enumLayer.wires);
                if (nextSlot !== null && negativeSlot != null) {
                    const bundleItem = new BundleItem(bundlerComp.storedItem, 10);

                    if (ejectorComp.tryEject(nextSlot, bundleItem)) {
                        ejectorComp.tryEject(negativeSlot, NEGATIVE_ENERGY_ITEM_SINGLETON);
                        bundlerComp.storedCount = 0;
                        bundlerComp.storedItem = null;
                        bundlerComp.energy -= 1;
                    }
                }
            }
        }
    }
}
