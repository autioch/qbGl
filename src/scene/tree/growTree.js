import growBranch from './growBranch';
import { BRANCH_MAX_COUNT, BRANCH_SUB } from './consts';

export default function growTree(mainBranch) {
  let branchCount = 1;
  const branchQueue = [mainBranch];

  while (branchQueue.length && branchCount < (BRANCH_MAX_COUNT - BRANCH_SUB)) {
    branchQueue.push(...growBranch(branchQueue.shift(), branchCount));
    branchCount += BRANCH_SUB;
  }

  return mainBranch;
}
