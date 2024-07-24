import { ApiAccountIdProperty } from '../../../../api-docs/custom-decorators/accountId-api-property.decorator';

export class AccountCloseDto {
  @ApiAccountIdProperty()
  readonly accountId: string;
}