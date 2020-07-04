import { globalConfig } from "../../core/config";
import { enumDirection, Vector } from "../../core/vector";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import { enumItemProcessorTypes, ItemProcessorComponent } from "../components/item_processor";
import { Entity } from "../entity";
import { MetaBuilding, defaultBuildingVariant } from "../meta_building";
import { GameRoot, enumLayer } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";
import { T } from "../../translations";
import { formatItemsPerSecond } from "../../core/utils";
import { AndnotComponent } from "../components/andnot";
import { Loader } from "../../core/loader";

/** @enum {string} */
export const enumSplitterVariants = {
    compact: "compact",
    compactInverse: "compact-inverse",
    andnot: "andnot",
};

export class MetaSplitterBuilding extends MetaBuilding {
    constructor() {
        super("splitter");
    }

    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumSplitterVariants.andnot:
                return new Vector(2, 1);
            case enumSplitterVariants.compact:
            case enumSplitterVariants.compactInverse:
                return new Vector(1, 1);
            default:
                assertAlways(false, "Unknown splitter variant: " + variant);
        }
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.splitter);
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    getSilhouetteColor() {
        return "#444";
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_splitter_compact)) {
            return [
                defaultBuildingVariant,
                enumSplitterVariants.compact,
                enumSplitterVariants.compactInverse,
                enumSplitterVariants.andnot,
            ];
        }
        return super.getAvailableVariants(root);
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_splitter);
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 1,
                processorType: enumItemProcessorTypes.splitter,
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ],
            })
        );
    }

    /**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                if (!entity.components.ItemProcessor) {
                    entity.addComponent(
                        new ItemProcessorComponent({
                            inputsPerCharge: 1,
                            processorType: enumItemProcessorTypes.splitter,
                        })
                    );
                }
                if (entity.components.Andnot) {
                    entity.removeComponent(AndnotComponent);
                }

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ]);

                entity.components.ItemAcceptor.beltUnderlays = [
                    { pos: new Vector(0, 0), direction: enumDirection.top, layer: enumLayer.regular },
                    { pos: new Vector(1, 0), direction: enumDirection.top, layer: enumLayer.regular },
                ];

                entity.components.StaticMapEntity.spriteKey = "sprites/buildings/" + this.id + ".png";

                break;
            }
            case enumSplitterVariants.compact:
            case enumSplitterVariants.compactInverse: {
                if (!entity.components.ItemProcessor) {
                    entity.addComponent(
                        new ItemProcessorComponent({
                            inputsPerCharge: 1,
                            processorType: enumItemProcessorTypes.splitter,
                        })
                    );
                }
                if (entity.components.Andnot) {
                    entity.removeComponent(AndnotComponent);
                }

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                    {
                        pos: new Vector(0, 0),
                        directions: [
                            variant === enumSplitterVariants.compactInverse
                                ? enumDirection.left
                                : enumDirection.right,
                        ],
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                ]);

                entity.components.ItemAcceptor.beltUnderlays = [
                    { pos: new Vector(0, 0), direction: enumDirection.top, layer: enumLayer.regular },
                ];

                entity.components.StaticMapEntity.spriteKey =
                    "sprites/buildings/" + this.id + "-" + variant + ".png";

                break;
            }
            case enumSplitterVariants.andnot: {
                if (entity.components.ItemProcessor) {
                    entity.removeComponent(ItemProcessorComponent);
                }
                if (!entity.components.Andnot) {
                    entity.addComponent(new AndnotComponent({}));
                }

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ]);

                entity.components.ItemAcceptor.beltUnderlays = [
                    { pos: new Vector(0, 0), direction: enumDirection.top, layer: enumLayer.regular },
                    { pos: new Vector(1, 0), direction: enumDirection.top, layer: enumLayer.regular },
                ];

                entity.components.StaticMapEntity.spriteKey = "sprites/buildings/" + this.id + ".png";

                break;
            }
            default:
                assertAlways(false, "Unknown painter variant: " + variant);
        }
    }

    getPreviewSprite(rotationVariant = 0, variant = defaultBuildingVariant) {
        switch (variant) {
            case enumSplitterVariants.andnot: {
                return Loader.getSprite("sprites/buildings/" + this.id + ".png");
            }
            default: {
                return super.getPreviewSprite(rotationVariant, variant);
            }
        }
    }

    getBlueprintSprite(rotationVariant = 0, variant = defaultBuildingVariant) {
        switch (variant) {
            case enumSplitterVariants.andnot: {
                return Loader.getSprite("sprites/blueprints/" + this.id + ".png");
            }
            default: {
                return super.getBlueprintSprite(rotationVariant, variant);
            }
        }
    }
}
