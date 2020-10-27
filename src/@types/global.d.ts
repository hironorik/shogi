declare namespace Game {
	enum lang {
		ja = 'ja',
		en = 'en',
	}
}

declare namespace Player {
	enum side {
		black = 'b',
		white = 'w',
	}
}

interface Address {
  x: number,
  y: number,
}

interface MoveAddress {
  x: number | string,
  y: number | string,
}

interface NameLang {
  ja: string,
  en: string,
}

interface NameVersion {
  full: NameLang,
  short: NameLang,
}

interface Name {
	normal: NameVersion,
	promoted?: NameVersion,
}