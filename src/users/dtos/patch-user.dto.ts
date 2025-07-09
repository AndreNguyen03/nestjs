import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
export class PatchUserDto extends PartialType(CreateUserDto) {
  // This class will inherit all properties from CreateUserDto
  // and make them optional, allowing for partial updates.
  // No additional properties are needed here.
}