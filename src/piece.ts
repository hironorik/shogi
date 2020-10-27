enum GameLang {
	ja = 'ja',
	en = 'en',
}

enum PlayerSide {
  black = 'b',
  white = 'w',
}

export class Piece {
  public id: number;
  public kind: string;
  public side: PlayerSide;
  public address: Address | undefined;
  public name: Name;
  public point: number;
  public isPromoted: boolean;
  public move: {
    normal: MoveAddress[],
    promoted?: MoveAddress[],
	};
	private lang: GameLang;

	constructor(
		id: number,
		kind: string,
		side: PlayerSide,
		address: Address,
		name: Name,
		point: number,
		move: { normal: MoveAddress[], promoted?: MoveAddress[] },
		lang: GameLang,
	) {
		this.id         = id;
		this.kind       = kind;
		this.side       = side;
		this.address    = address;
		this.name       = name;
		this.point      = point;
		this.isPromoted = false;
		this.move       = move;
		this.lang       = lang;
	}

	promote() {
		this.isPromoted = true;
	}

	get shortName(): string {
		return this.isPromoted ? (this.name.promoted as NameVersion).short[this.lang] : this.name.normal.short[this.lang];
	}

	get fullName(): string {
		return this.isPromoted ? (this.name.promoted as NameVersion).full[this.lang] : this.name.normal.full[this.lang];
	}

	get moves(): MoveAddress[] {
		return this.isPromoted ? this.move.promoted as MoveAddress[] : this.move.normal;
	}

	public setAddress(address: Address | undefined): void {
		this.address = address;
	}

	public taken(): void {
		this.address = undefined;
		this.side = this.side === PlayerSide.black ? PlayerSide.white : PlayerSide.black;
	}

	static isFuncutionalMoveDimension(move: number | string): boolean {
		return typeof move === 'string' && move.includes('n');
	}
}