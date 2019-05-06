# Authorization

## Structure

The authorization could look like this:

```yaml
- admin:
	routes:
		- verb  : GET
		  path  : /orders
		  access: _all
		- verb  : GET
		  path  : /orders/:id
		  access: _all
		- verb  : GET
		  path  : /order-dates
		  access: _all
		- verb  : GET
		  path  : /order-dates/:id
		  access: _all
- qaExecutive:
	routes:
		- verb  : GET
		  path  : /orders
		  access: _self
		- verb  : GET
		  path  : /order-dates/:id/machines
		  access: _self
	routesExcept:
    - verb  : GET
		  path  : /some-other-route
		  access: _all
```

Commonly it could look like this:

```yaml
- <role>: # like admin, qa, production
	<'routes'|'routesExcept'>:
		- verb  : <HTTPVerb> # like GET, POST, PUT, DELETE, PATCH, FETCH etc.
		  path  : <route> # like /orders
		  access: <user|role|Accesspath # like _all, _self, production (role), jon.doe (user)
```

Notes:

* Application must follow RESTful strictly.
* Userpathand role pathmust not start with a low-dash!
* `routes` and `routesExcept` are logically combined with smaller routes more dominant than longer routes of the same path.
* Multiple `routes` or `routesExcept` are logically combined.
