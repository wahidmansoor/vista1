import { breastCancerPathway } from "./breast";
import { prostateCancerPathway } from "./prostate";
import { lungCancerPathway } from "./lung";
import { ovarianCancerPathway } from "./ovarian";
import { gastricCancerPathway } from "./gastric";
import { headNeckCancerPathway } from "./head-neck";
import { pancreaticCancerPathway } from "./pancreatic";
import { bladderCancerPathway } from "./bladder";
import { StepBasedPathway } from "../../types/cancer-pathways";

export const pathways: Record<string, StepBasedPathway> = {
  breast: breastCancerPathway,
  prostate: prostateCancerPathway,
  lung: lungCancerPathway,
  ovarian: ovarianCancerPathway,
  gastric: gastricCancerPathway,
  head_neck: headNeckCancerPathway,
  pancreatic: pancreaticCancerPathway,
  bladder: bladderCancerPathway
};

export {
  breastCancerPathway,
  prostateCancerPathway,
  lungCancerPathway,
  ovarianCancerPathway,
  gastricCancerPathway,
  headNeckCancerPathway,
  pancreaticCancerPathway,
  bladderCancerPathway
};
