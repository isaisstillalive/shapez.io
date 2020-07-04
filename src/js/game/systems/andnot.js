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
import { Loader } from "../../core/loader";

/**
 * @typedef {{
 *   item: BaseItem,
 *   slot: number,
 * }} ItemSlot
 */

export class AndnotSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [AndnotComponent]);

        this.storageOverlaySprite = Loader.getSprite("sprites/misc/storage_overlay.png");
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

            andnotComp.intervals[0] += beltSpeed;
            andnotComp.blocking -= beltSpeed;

            if (andnotComp.items.length == 0) {
                continue;
            }

            const ejectorComp = entity.components.ItemEjector;
            /** @type Set<number> */
            const acceptedItems = new Set();
            for (let index = 0; index < andnotComp.items.length; index++) {
                const item = andnotComp.items[index];
                acceptedItems[item.slot] = item;
            }
            /** @type Array<BaseItem> */
            const ejectedItems = [];

            {
                /** @type ItemSlot */
                const blocker = acceptedItems[1];
                if (blocker) {
                    if (ejectorComp.tryEject(1, blocker.item)) {
                        andnotComp.blocking = andnotComp.intervals.reduce((a, b) => Math.max(a, b), 0);
                        andnotComp.intervals.unshift(3);
                        andnotComp.intervals.pop();
                        ejectedItems.push(blocker.item);
                    }
                }
            }
            {
                /** @type ItemSlot */
                const mainItem = acceptedItems[0];
                if (mainItem) {
                    let ejectSlot = 1;

                    if (andnotComp.blocking <= 0) {
                        andnotComp.blocking = 0;
                        ejectSlot = 0;
                    }

                    if (ejectorComp.tryEject(ejectSlot, mainItem.item)) {
                        ejectedItems.push(mainItem.item);
                    }
                }
            }

            andnotComp.items = andnotComp.items.filter(item => ejectedItems.indexOf(item.item) == -1);
        }
    }

    draw(parameters) {
        this.forEachMatchingEntityOnScreen(parameters, this.drawEntity.bind(this));
    }

    /**
     * @param {DrawParameters} parameters
     * @param {Entity} entity
     */
    drawEntity(parameters, entity) {
        const context = parameters.context;
        const staticComp = entity.components.StaticMapEntity;

        if (!staticComp.shouldBeDrawn(parameters)) {
            return;
        }

        const center = staticComp.getTileSpaceBounds().getCenter().toWorldSpace();
        this.storageOverlaySprite.drawCached(parameters, center.x - 15, center.y - 7.5, 30, 15);

        context.font = "bold 6px GameFont";
        context.textAlign = "center";
        context.fillStyle = "#64666e";
        context.fillText("ANDNOT", center.x, center.y + 2);

        context.textAlign = "left";
        context.globalAlpha = 1;
    }
}
