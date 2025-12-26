import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import { dataDir } from "../../_constants/data";

const todoJson = path.join(dataDir, "todo.json");
const todoScheme = z.object({
	id: z.number(),
	title: z.string(),
	complete: z.boolean(),
});

function init(): void {
	try {
		// dataディレクトリが存在しない場合は作成
		if (!fs.existsSync(dataDir)) {
			fs.mkdirSync(dataDir, { recursive: true });
		}

		// todo.jsonファイルが存在しない場合は初期化
		if (!fs.existsSync(todoJson)) {
			fs.writeFileSync(todoJson, "[]");
		}
	} catch (e) {
		throw new Error(String(e));
	}
}
export type Todo = z.infer<typeof todoScheme>;

export function getTodos(): Todo[] {
	try {
		init();

		const data = JSON.parse(fs.readFileSync(todoJson, "utf-8"));
		if (!data) return [];
		const todos = data.map((item: unknown) => {
			const todo = todoScheme.parse(item);
			return todo;
		});
		return todos;
	} catch (e) {
		console.error(e);
		throw new Error("Could not read todo file");
	}
}

export function writeTodos(todos: Todo[]): void {
	try {
		fs.writeFileSync(todoJson, JSON.stringify(todos));
	} catch (e) {
		throw new Error(String(e));
	}
}
