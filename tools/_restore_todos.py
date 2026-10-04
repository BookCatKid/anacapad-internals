"""Restore the binary todo invariant after the bulk-closure mistake.

Rule: todo present = recoverable work remains; todo absent = 100% resolved.

- Every 'Resolved*'/script-added 'Established*' entry inside todo is a finding,
  not a state. Move it to record['resolved_findings'] so the research is kept.
- Records that had a todo at the merge-base get their ORIGINAL todo list back
  verbatim (conservative: anything not demonstrably 100% resolved reopens).
- Records with no merge-base todo keep any genuine non-closure ask items; if
  nothing but closure text remains, the todo field is deleted.
"""
import json, os, sys

BASE = json.load(open('/tmp/doc_before.json'))
CUR = json.load(open('docs/documentation.json'))

migrated = reopened = deleted = kept_asks = 0

def handle(brec, crec):
    global migrated, reopened, deleted, kept_asks
    todo = crec.get('todo')
    if not isinstance(todo, list):
        return
    base_todo = brec.get('todo') if isinstance(brec, dict) else None
    resolved = [t for t in todo if str(t).startswith('Resolved')]
    new_est = [t for t in todo
               if str(t).startswith('Established')
               and (not base_todo or t not in base_todo)]
    others = [t for t in todo
              if not str(t).startswith(('Resolved', 'Established'))]
    findings = resolved + new_est
    if findings:
        crec.setdefault('resolved_findings', []).extend(findings)
        migrated += len(findings)
    if base_todo:
        crec['todo'] = base_todo
        reopened += 1
    elif others:
        crec['todo'] = others
        kept_asks += 1
    else:
        del crec['todo']
        deleted += 1

def walk(b, c):
    if isinstance(c, dict):
        for k, v in list(c.items()):
            bv = b.get(k) if isinstance(b, dict) else None
            if k == 'todo':
                handle(b, c)
            else:
                walk(bv, v)
    elif isinstance(c, list):
        for i, item in enumerate(c):
            bi = b[i] if isinstance(b, list) and i < len(b) else None
            walk(bi, item)

walk(BASE, CUR)
json.dump(CUR, open('docs/documentation.json.tmp', 'w'), indent=1)
os.replace('docs/documentation.json.tmp', 'docs/documentation.json')
print(f'findings migrated: {migrated}')
print(f'records reopened (original todo restored): {reopened}')
print(f'records keeping non-closure asks (no base todo): {kept_asks}')
print(f'todos deleted (no base todo, only closure text): {deleted}')
