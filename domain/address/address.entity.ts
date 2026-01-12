export class Address {
    constructor(
        public readonly street?: string,
        public readonly city?: string,
        public readonly state?: string,
        public readonly zipCode?: string,
        public readonly country?: string,
    ) { }
  }