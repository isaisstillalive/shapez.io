import { formatItemsPerSecond } from "../../core/utils";
import { enumDirection, Vector } from "../../core/vector";
import { T } from "../../translations";
import { enumItemType } from "../base_item";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import { enumItemProcessorTypes, ItemProcessorComponent } from "../components/item_processor";
import { Entity } from "../entity";
import { MetaBuilding, defaultBuildingVariant } from "../meta_building";
import { GameRoot, enumLayer } from "../root";
import { WiredPinsComponent, enumPinSlotType } from "../components/wired_pins";
import { EnergyConsumerComponent } from "../components/energy_consumer";
import { BundlerComponent } from "../components/bundler";

/** @enum {string} */
export const enumAdvancedProcessorVariants = { bundler: "bundler" };

export class MetaAdvancedProcessorBuilding extends MetaBuilding {
    constructor() {
        super("advanced_processor");
    }

    getSilhouetteColor() {
        return "#25d7b8";
    }

    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
                return new Vector(2, 2);
            case enumAdvancedProcessorVariants.bundler:
                return new Vector(2, 1);
            default:
                assertAlways(false, "Unknown advanced processor variant: " + variant);
        }
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        let speed;
        switch (variant) {
            case defaultBuildingVariant:
                speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.advancedProcessor);
                break;
            case enumAdvancedProcessorVariants.bundler:
                speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.advancedProcessor);
                break;
            default:
                assertAlways(false, "Unknown advanced processor variant: " + variant);
        }

        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumAdvancedProcessorVariants.bundler];
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        // TODO
        return true;
        // return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_and_trash);
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 1,
                processorType: enumItemProcessorTypes.advancedProcessor,
            })
        );

        entity.addComponent(new ItemEjectorComponent({ slots: [] }));
        entity.addComponent(
            new EnergyConsumerComponent({
                bufferSize: 3,
                perCharge: 1,
                batteryPosition: new Vector(),
                acceptorSlotIndex: 0,
                ejectorSlotIndex: 0,
            })
        );
        entity.addComponent(new WiredPinsComponent({ slots: [] }));
        entity.addComponent(new ItemAcceptorComponent({ slots: [] }));
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
                            processorType: enumItemProcessorTypes.advancedProcessor,
                        })
                    );
                }
                if (entity.components.Bundler) {
                    entity.removeComponent(BundlerComponent);
                }

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.left],
                    },
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.top],
                        filter: enumItemType.positiveEnergy,
                        layer: enumLayer.wires,
                    },
                ]);
                Object.assign(entity.components.EnergyConsumer, {
                    bufferSize: 3,
                    perCharge: 0.25,
                    batteryPosition: new Vector(4, 6.5),
                    acceptorSlotIndex: 1,
                    ejectorSlotIndex: 1,
                });
                entity.components.WiredPins.setSlots([
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.positiveEnergyAcceptor,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.negativeEnergyEjector,
                    },
                ]);
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(1, 0), direction: enumDirection.right },
                    { pos: new Vector(1, 0), direction: enumDirection.top, layer: enumLayer.wires },
                ]);
                break;
            }
            case enumAdvancedProcessorVariants.bundler: {
                if (entity.components.ItemProcessor) {
                    entity.removeComponent(ItemProcessorComponent);
                }
                if (!entity.components.Bundler) {
                    entity.addComponent(new BundlerComponent({}));
                }

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 1),
                        directions: [enumDirection.left],
                        filter: enumItemType.shape,
                    },
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.top],
                        filter: enumItemType.positiveEnergy,
                        layer: enumLayer.wires,
                    },
                ]);
                Object.assign(entity.components.EnergyConsumer, {
                    bufferSize: 3,
                    perCharge: 0.25,
                    batteryPosition: new Vector(4, 6.5),
                    acceptorSlotIndex: 1,
                    ejectorSlotIndex: 1,
                });
                entity.components.WiredPins.setSlots([
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.positiveEnergyAcceptor,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.negativeEnergyEjector,
                    },
                ]);
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(1, 0), direction: enumDirection.right },
                    { pos: new Vector(1, 0), direction: enumDirection.top, layer: enumLayer.wires },
                ]);
                break;
            }
        }
    }
}
