import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUserData } from "../interface/active-user-data.interface";
import { REQUEST_USER_KEY } from "../constants/auth.constants";

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user: ActiveUserData = request[REQUEST_USER_KEY];

        return field ? user?.[field] : user;
    },
)