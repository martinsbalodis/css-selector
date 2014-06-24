var selector, $el;
jQuery("body").append("<div id='tests'></div>");

describe("CSS Selector Simple", function () {

	beforeEach(function () {

        $el = jQuery("#tests").html("");
		selector = new CssSelector({
			parent: jQuery('#tests')[0],
			enableResultStripping: false,
			ignoredClasses: [
				'test-ignore-tags',
				'test-multi-element-n',
				'test-skip-top-n'
			]
		});
	});

	it("should be able to select one element", function () {

        $el.append('<div><a name="test-simple-element"></a><b></b></div><a></a>');

		var element = document.getElementsByName('test-simple-element')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("div:nth-of-type(1) > a:nth-of-type(1)");
	});

	it("should be able to select multiple elements", function () {

        $el.append('<div><span><a name="test-milti-element"></a></span><span><a name="test-milti-element"></a></span></div>');

		var elements = document.getElementsByName('test-milti-element');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("div:nth-of-type(1) > span > a:nth-of-type(1)");
	});

	it("should be able to select multiple elements n+", function () {

        $el.append('<div><span><a></a></span><span><a class="test-multi-element-n"></a></span><span><a class="test-multi-element-n"></a></span></div>');

		var elements = jQuery('.test-multi-element-n');
		var css_selector = selector.getCssSelector(elements);


		expect(css_selector).toBe("div:nth-of-type(1) > span:nth-of-type(n+2) > a:nth-of-type(1)");
	});

	it("should be able to ignore tags", function () {

        $el.append('<table><tr><td><font class="test-ignore-tags"></font></td></tr></table>');
		var elements = jQuery('.test-ignore-tags');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("table:nth-of-type(1) > tbody:nth-of-type(1) > tr:nth-of-type(1) > td:nth-of-type(1)");
	});

	it("should be able to skip elements from top", function () {

        $el.append('<table><tr><td><span class="test-skip-top"></span></td></tr></table>');

		var elements = jQuery('.test-skip-top');
		var css_selector = selector.getCssSelector(elements, 2);

		expect(css_selector).toBe("table:nth-of-type(1) > tbody:nth-of-type(1) > tr:nth-of-type(1)");
	});

	it("should be able to skip elements from top and use n+1 selectors", function () {

        $el.append('<table><tr><td><span></span></td></tr><tr><td><span class="test-skip-top-n"></span></td></tr><tr><td><span class="test-skip-top-n"></span></td></tr></table>');

		var elements = jQuery('.test-skip-top-n');
		var css_selector = selector.getCssSelector(elements, 2);

		expect(css_selector).toBe("table:nth-of-type(1) > tbody:nth-of-type(1) > tr:nth-of-type(n+2)");
	});
});

describe("CSS Selector Strip", function () {

	beforeEach(function () {

        $el = jQuery("#tests").html("");
		selector = new CssSelector({
			parent: jQuery('#tests')[0],
			ignoredClasses:['do-not-strip-direct-child-test']
		});
	});

	it("should be able to strip indexes", function () {

        $el.append('<input name="strip-index-test"/>');
		var element = document.getElementsByName('strip-index-test')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("input");
	});

	it("should be able to strip ids", function () {

        $el.append('<textarea name="strip-id-test" id="strip-id-test"></textarea>');
		var element = document.getElementsByName('strip-id-test')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("textarea");
	});

	it("should be able to strip classes", function () {

        $el.append('<div><span><b><select name="strip-tags-test"></select></b></span></div>');
		var element = document.getElementsByName('strip-tags-test')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("select");
	});

	it("should be able to strip whole tags", function () {

        $el.append('<div><span class="needed strip"><a name="strip-classes-test"></a></span><span class="strip"><a></a></span></div>');
		var element = document.getElementsByName('strip-classes-test')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("span.needed a");
	});

	it("should not strip direct child when a subchild exists", function () {

        $el.append('<div><span><div class="do-not-strip-direct-child-test"><div><div></div></div></div><div class="do-not-strip-direct-child-test"></div></span></div>');
		var elements = $('.do-not-strip-direct-child-test');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("span > div");
	});

});

describe("Smart table selectors", function () {

	beforeEach(function () {

        $el = jQuery("#tests").html("");
		selector = new CssSelector({
			parent: jQuery('#tests')[0],
			enableSmartTableSelector: true,
			query: jQuery
		});
	});

	it("should be select cells based on text in desciption cell", function () {

        $el.append('<table><tr><td> Item:</td><td class="table-cell-test1">needed data</td></tr><tr><td>Not needed item</td><td class="table-cell-test1">Not needed item</td></tr></table>');
		var element = document.getElementsByClassName('table-cell-test1')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("tr:contains('Item:') td.table-cell-test1");
	});

	it("should be select cells based on text in desciption cell(th)", function () {

        $el.append('<table><tr><th>Item2:</th><td class="table-cell-test3">needed data</td></tr><tr><th>Not needed item</th><td class="table-cell-test3">Not needed item</td></tr></table>');
		var element = document.getElementsByClassName('table-cell-test3')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("tr:contains('Item2:') td.table-cell-test3");
	});

	it("should drop its smartness when selecting multiple items", function () {

        $el.append('<table><tr><td>1</td><td class="table-cell-test2"></td></tr><tr><td>2</td><td class="table-cell-test2"></td></tr></table>');
		var elements = jQuery('.table-cell-test2');
		var css_selector = selector.getCssSelector(elements);

        expect(css_selector).toBe("td.table-cell-test2");
	});

});

describe("Ignored classes", function () {

	beforeEach(function () {

        $el = jQuery("#tests").html("");
		selector = new CssSelector({
			parent: jQuery('#tests')[0],
			ignoredClasses: ['ignored']
		});
	});

	it("should ignore classes", function () {

        $el.append('<div><a class="ignored ignored-class-test1"></a><a></a></div>');
		var element = document.getElementsByClassName('ignored-class-test1')[0];
		var css_selector = selector.getCssSelector([element]);

		expect(css_selector).toBe("a.ignored-class-test1");
	});

});

describe("Bugs", function () {

	beforeEach(function () {

        $el = jQuery("#tests").html("");
	});

	it("should select children of parent while using jquery", function () {

        $el.append('<div id="jquery-children-test-parent"><a></a></div><a></a>');
        selector = new CssSelector({
             parent: jQuery('#jquery-children-test-parent')[0],
             query: jQuery
        });
		var elements = jQuery('#jquery-children-test-parent a');
		var css_selector = selector.getCssSelector(elements);

		expect(css_selector).toBe("a");
	});

});
