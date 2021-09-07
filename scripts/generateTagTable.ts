import * as fs from 'fs';
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

console.log('');
console.log(table);
console.log('');

fs.writeFile('./out/TAGS.md', table, 'utf8', function (err) {
    if (err) {
        throw err;
    }
});
