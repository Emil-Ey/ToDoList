import DataLoader from "dataloader";
import { List } from "../entity/List";

export const createListLoader = () =>
	new DataLoader<number, List>(async (listIds) => {
		const lists = await List.findByIds(listIds as number[]);
		const listIdToList: Record<number, List> = {};
		lists.forEach((l) => {
			listIdToList[l.id] = l;
		});

		return listIds.map((userId) => listIdToList[userId]);
	});
