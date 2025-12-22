import type { AstroGlobal } from "astro";
import { type Todo, writeTodos } from "./todoFileOperations";

// PuTリクエストの処理
export const handlePutRequest = async (
	todos: Todo[],
	id: string,
	Astro: AstroGlobal
) => {
	// フォームデータとJSONの両方に対応
	let complete: boolean;

	try {
		const formData = await Astro.request.formData();
		const completeValue = formData.get("complete");
		complete = completeValue === "on" || completeValue === "true";
	} catch {
		// フォームデータが失敗した場合は現在のcomplete状態を反転
		const currentTodo = todos.find((todo: Todo) => todo.id === Number(id));
		complete = currentTodo ? !currentTodo.complete : false;
	}

	const newTodos = todos.map((todo: Todo) => {
		if (todo.id === Number(id)) {
			return { ...todo, complete };
		}
		return todo;
	});
	writeTodos(newTodos);
	Astro.response.status = 200;
};

// DELETEリクエストの処理
export const handleDeleteRequest = (
	todos: Todo[],
	id: string,
	Astro: AstroGlobal
) => {
	const newTodos = todos.filter((todo: Todo) => todo.id !== Number(id));
	writeTodos(newTodos);
	Astro.response.status = 200;
	return newTodos.length;
};

// PATCHリクエストの処理
export const handlePatchRequest = async (
	todos: Todo[],
	id: string,
	Astro: AstroGlobal
) => {
	try {
		const body = await Astro.request.text();
		if (!body || body.trim() === "") {
			throw new Error("Request body is empty");
		}

		let json: { title?: unknown };
		try {
			json = JSON.parse(body);
		} catch (parseError) {
			console.error("JSON parse error:", parseError);
			throw new Error("Invalid JSON format");
		}

		const title = json.title;
		if (typeof title !== "string") throw new Error("title is not string");

		const newTodos = todos.map((todo: Todo) => {
			if (todo.id === Number(id)) {
				return { ...todo, title: title };
			}
			return todo;
		});
		writeTodos(newTodos);
		Astro.response.status = 200;
	} catch (error) {
		console.error("PATCH request error:", error);
		Astro.response.status = 400;
	}
};
