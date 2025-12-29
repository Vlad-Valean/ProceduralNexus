#!/bin/bash
# Auto-generated Redis migration script

echo "Executing migration: V3__setup.sh"

docker exec proceduralnexus-redis-stack-1 bash -c '
 FT.DROPINDEX idx:chatmessage
 FT.CREATE idx:chatmessage ON JSON PREFIX 1 chatmessage: SCHEMA $.session_id AS session_id TEXT $.role AS role TEXT $.content AS content TEXT $.timestamp AS timestamp TEXT
 FT.DROPINDEX idx:documentchunk
 FT.CREATE idx:documentchunk ON JSON PREFIX 1 documentchunk: SCHEMA $.doc_id AS doc_id TEXT $.chunk_id AS chunk_id TEXT $.content AS content TEXT $.metadata.source AS metadata_source TEXT $.metadata.page AS metadata_page TEXT $.metadata.created_at AS metadata_created_at TEXT $.embedding AS embedding VECTOR FLAT 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
 FT.DROPINDEX idx:metadata
 FT.CREATE idx:metadata ON JSON PREFIX 1 metadata: SCHEMA $.source AS source TEXT $.page AS page TEXT $.created_at AS created_at TEXT
 FT.DROPINDEX idx:semanticcacheentry
 FT.CREATE idx:semanticcacheentry ON JSON PREFIX 1 semanticcache: SCHEMA $.original_query AS original_query TEXT $.response AS response TEXT $.embedding AS embedding VECTOR FLAT 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
'

echo "Migration completed."
