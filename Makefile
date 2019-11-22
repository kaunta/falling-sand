game.js: game.ts
	tsc --target ES6 game.ts

clean:
	-rm game.js
