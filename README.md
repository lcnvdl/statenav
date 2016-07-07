# Statenav
Hyper-simple push/pop state navigation, compatible with Pjax.

# Usage

1. Import the script *statenav.js*

2. Add a container
```
<div id="container"></div>
```

3. Initialize StateNav with the container
```
<script>
	statenav.initialize("#container");
</script>
```

4. Add the *statenav* class for all your links
```
<a href="/page1" class="statenav">My link</a>
```