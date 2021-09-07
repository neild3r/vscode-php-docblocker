import Tags from "../src/tags";
import { getMarkdownTable } from 'markdown-table-ts';

let tags = new Tags();

let formatted: string[][] = [];
tags.list.forEach(tag => {
    formatted.push([tag.tag, tag.snippet]);
});

let table = getMarkdownTable({
    table: {
        head: ['Tag', 'Snippet'],
        body: formatted
    },
});

console.log(table);