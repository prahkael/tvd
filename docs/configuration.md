# Configuration

## User roles

* admin
* supervisor
* productionLead
* productionExecutive
* qaLead
* qaExecutive
* salesLead
* salesExecutive

## User sensitive configuration settings

```yaml
- qaExecutive:
	views:
		- name: orders
		  columns: ['a', 'b']
      columnsExcept: ['x', 'y']
```
