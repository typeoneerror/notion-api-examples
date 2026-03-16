# Views

## Endpoints

### Basics

[x] GET /v1/views?database_id=DATABASE_ID - List all views for a database
[x] GET /v1/views/VIEW_ID - Retrieve a specific view
[x] PATCH /v1/views/VIEW_ID - Update a view
[x] DELETE /v1/views/VIEW_ID - Delete a view

### Requires bugfix

[ ] POST /v1/views - Create a new view

### Queries

[ ] POST /v1/views/VIEW_ID/queries - Query a view (create query)
[ ] GET /v1/views/VIEW_ID/queries/QUERY_ID - Paginate query results
[ ] DELETE /v1/views/VIEW_ID/queries/QUERY_ID - Cleanup query
