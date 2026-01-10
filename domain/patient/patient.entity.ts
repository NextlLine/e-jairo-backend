export class Patient {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly motherName: string,
        public readonly doc: string,
        public readonly phone: string,
        public readonly birthDate: string,
        public readonly teamId: string
    ) { }
}