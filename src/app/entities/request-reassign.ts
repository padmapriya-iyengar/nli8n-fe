export class REQUEST_REASSIGN{
    Officers: Array<OFFICER_DETAILS> = new Array<OFFICER_DETAILS>();
    Remarks!: string;
    ParentItemID!: string;
}

export class OFFICER_DETAILS{
    OfficerName!: string;
    OfficerCode!: string;
    IsMainOfficer!: string;
    OfficerDivision!: string;
}