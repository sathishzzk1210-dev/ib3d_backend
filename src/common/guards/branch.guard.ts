import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class BranchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
 
    const branchId = request.body.branch_id || request.params.branchId;


  
    if (!branchId) return true; // some routes may not need branch check

    // Super Admin bypass



    throw new ForbiddenException('Access to this branch is denied');
  }
}
