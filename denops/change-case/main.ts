import {
  Denops,
  camelCase,
  ensureNumber,
  execute,
  fn,
} from "./deps.ts";

      // hoge-fuga
export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async "change-case"(
      line: unknown,
    ): Promise<unknown> {
      ensureNumber(line);

      const text = await fn.getline(denops, line)
      const startPos = await fn.getpos(denops, "'<");
      const endPos = await fn.getpos(denops, "'>");
      
      const startCol = startPos[2] - 1;
      const endCol = endPos[2];

      const range = endCol - startCol;
      const selectedText = text.substring(startCol, range);
      console.log({startCol, endCol, range, text, selectedText});
      const trimedText = selectedText.trim();

      // console.log(selectedText);
      if (trimedText.length === 0 || /¥s/.test(trimedText)) {
        return await Promise.resolve();
      }

      const result = camelCase(trimedText);
      console.log(result);

      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! -range ChangeCaseCamel echomsg denops#request('${denops.name}', 'change-case', [<line1>])`
  )
}
