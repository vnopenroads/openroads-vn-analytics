
# openroads analytics

Use turf to sum up road lengths, broken down by road condition.  Easy to modify this to other metrics or breakdowns.  Meant to be used with the [admin endpoint](https://github.com/developmentseed/openroads-api/blob/develop/routes/admin.js)

Try it.  With the api running on `localhost:4000`, do:

```
curl http://localhost:4000/admin/municipality/177:15:213 | node example.js
```

