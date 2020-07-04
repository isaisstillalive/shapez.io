import { globalConfig } from "../../core/config";
import { DrawParameters } from "../../core/draw_parameters";
import { enumDirectionToVector } from "../../core/vector";
import { BaseItem } from "../base_item";
import { MinerComponent } from "../components/miner";
import { Entity } from "../entity";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { MapChunkView } from "../map_chunk_view";
import { enumLayer } from "../root";
import { AndnotComponent } from "../components/andnot";

export class AndnotSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [AndnotComponent]);
    }

    update() {
        // Divide by item spacing on belts since we use throughput and not speed
        let beltSpeed =
            this.root.hubGoals.getBeltBaseSpeed(enumLayer.regular) * this.root.dynamicTickrate.deltaSeconds;

        if (G_IS_DEV && globalConfig.debug.instantBelts) {
            beltSpeed *= 100;
        }

        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];

            const andnotComp = entity.components.Andnot;

            andnotComp.interval += beltSpeed;

            andnotComp.blocking -= beltSpeed;
            if (andnotComp.blocking <= 0) {
                andnotComp.blocking = 0;
                const ejectorComp = entity.components.ItemEjector;

                const nextSlot = ejectorComp.getFirstFreeSlot(enumLayer.regular);
                if (nextSlot !== null) {
                    if (ejectorComp.tryEject(nextSlot, andnotComp.item)) {
                        andnotComp.item = null;
                    }
                }
            }
        }
    }
}
