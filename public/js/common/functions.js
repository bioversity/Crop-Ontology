/**
 * Common functions
 **/

/**
 * Remove a specific value from a given array
 * @param  array                  array                           The array to clean
 * @param  value                  string                          The value to remove
 * @return array                                                  The cleaned array
 **/
function array_clean(array, value) {
    return jQuery.grep(array, function(val) {
        return val != value;
    });
}

/**
 * Replace a specific value from a given object
 * @param  array                  array                           The array to clean
 * @param  value                  string                          The value to remove
 * @return array                                                  The cleaned array
 **/
function object_key_replace(search, replace, object) {
    for(var k in object) {
        log(k);
    }
    // $.each(object, (k, v) {
    //     if(k == search) {
    //         object[k] = replace;
    //     }
    // });
    return object;
}
