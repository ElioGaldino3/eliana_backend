import { EntityRepository, Repository } from "typeorm";
import { Billing } from "./billing.entity";

@EntityRepository(Billing)
export class BillingRepository extends Repository<Billing> {}