#!/bin/bash
cd /home/kavia/workspace/code-generation/note-organizer-6efea1cf/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

